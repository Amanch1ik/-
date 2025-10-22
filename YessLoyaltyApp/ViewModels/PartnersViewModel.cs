using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using YessLoyaltyApp.Services;
using System.Linq; // Added for .Where() and .ToList()
using System; // Added for StringComparison
using System.Windows.Input; // Added for ICommand
using Microsoft.Maui.Controls; // Added for Command

namespace YessLoyaltyApp.ViewModels
{
    public class Partner
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string LogoPath { get; set; }
        public string CashbackPercentage { get; set; }
    }

    public class PartnersViewModel : INotifyPropertyChanged
    {
        private readonly ApiService _apiService;
        private readonly ICacheService _cacheService;
        private readonly IMonitoringService _monitoringService;
        private readonly IErrorHandlingService _errorHandlingService;

        private ObservableCollection<PartnerDto> _partners;
        private bool _isLoading;
        private string _searchText;
        private string _selectedCategory;

        public ObservableCollection<PartnerDto> Partners 
        { 
            get => _partners; 
            private set 
            {
                _partners = value;
                OnPropertyChanged();
            }
        }

        public bool IsLoading 
        { 
            get => _isLoading; 
            private set 
            {
                _isLoading = value;
                OnPropertyChanged();
            }
        }

        public string SearchText 
        { 
            get => _searchText; 
            set 
            {
                _searchText = value;
                FilterPartners();
                OnPropertyChanged();
            }
        }

        public string SelectedCategory 
        { 
            get => _selectedCategory; 
            set 
            {
                _selectedCategory = value;
                FilterPartners();
                OnPropertyChanged();
            }
        }

        private ObservableCollection<PartnerDto> _allPartners;

        public ICommand LoadPartnersCommand { get; }
        public ICommand RefreshPartnersCommand { get; }

        public PartnersViewModel(
            ApiService apiService, 
            ICacheService cacheService,
            IMonitoringService monitoringService,
            IErrorHandlingService errorHandlingService)
        {
            _apiService = apiService;
            _cacheService = cacheService;
            _monitoringService = monitoringService;
            _errorHandlingService = errorHandlingService;

            _partners = new ObservableCollection<PartnerDto>();
            _allPartners = new ObservableCollection<PartnerDto>();

            LoadPartnersCommand = new Command(async () => await LoadPartnersAsync());
            RefreshPartnersCommand = new Command(async () => await LoadPartnersAsync(true));

            // Автоматическая загрузка при создании
            LoadPartnersAsync();
        }

        private async Task LoadPartnersAsync(bool forceRefresh = false)
        {
            try 
            {
                IsLoading = true;
                _monitoringService.TrackEvent("LoadPartners_Started");

                // Ключ для кэширования
                const string CACHE_KEY = "partners_list";

                // Попытка получить из кэша с принудительным обновлением
                var partners = await _cacheService.GetOrCreateAsync(
                    CACHE_KEY, 
                    async () => 
                    {
                        var response = await _apiService.GetPartnersAsync();
                        
                        if (response.IsSuccess)
                        {
                            return response.Data;
                        }
                        else
                        {
                            await _errorHandlingService.DisplayErrorAsync(response.ErrorMessage);
                            return new List<PartnerDto>();
                        }
                    },
                    // Кэшируем на 1 час, если не указано принудительное обновление
                    forceRefresh ? TimeSpan.Zero : TimeSpan.FromHours(1)
                );

                _allPartners = new ObservableCollection<PartnerDto>(partners);
                FilterPartners();

                _monitoringService.TrackEvent("LoadPartners_Completed", new Dictionary<string, string>
                {
                    ["PartnersCount"] = partners.Count.ToString()
                });
            }
            catch (Exception ex)
            {
                _monitoringService.TrackException(ex);
                await _errorHandlingService.DisplayErrorAsync("Не удалось загрузить партнеров");
            }
            finally 
            {
                IsLoading = false;
            }
        }

        private void FilterPartners()
        {
            if (string.IsNullOrWhiteSpace(SearchText) && string.IsNullOrWhiteSpace(SelectedCategory))
            {
                Partners = _allPartners;
                return;
            }

            Partners = new ObservableCollection<PartnerDto>(
                _allPartners.Where(p => 
                    (string.IsNullOrWhiteSpace(SearchText) || 
                     p.Name.Contains(SearchText, StringComparison.OrdinalIgnoreCase)) &&
                    (string.IsNullOrWhiteSpace(SelectedCategory) || 
                     p.Category == SelectedCategory)
            ));
        }

        public event PropertyChangedEventHandler PropertyChanged;
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
