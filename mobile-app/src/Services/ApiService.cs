using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace YessLoyalty.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private string _baseUrl = "https://api.yessloyalty.com/v1";
        private string _authToken;

        public ApiService()
        {
            _httpClient = new HttpClient();
        }

        public void SetAuthToken(string token)
        {
            _authToken = token;
            _httpClient.DefaultRequestHeaders.Authorization = 
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<T> GetAsync<T>(string endpoint)
        {
            try 
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/{endpoint}");
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(content);
            }
            catch (HttpRequestException ex)
            {
                HandleError(ex);
                return default;
            }
        }

        public async Task<T> PostAsync<T>(string endpoint, object data)
        {
            try 
            {
                var json = JsonSerializer.Serialize(data);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_baseUrl}/{endpoint}", content);
                response.EnsureSuccessStatusCode();
                var responseContent = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(responseContent);
            }
            catch (HttpRequestException ex)
            {
                HandleError(ex);
                return default;
            }
        }

        private void HandleError(Exception ex)
        {
            // Логирование ошибок, можно подключить Sentry или другой сервис
            Console.WriteLine($"API Error: {ex.Message}");
        }
    }
}
