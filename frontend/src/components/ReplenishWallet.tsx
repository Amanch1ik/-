/**
 * Компонент пополнения кошелька для Bonus APP
 * Современный UI с поддержкой всех методов оплаты
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Dimensions
} from 'react-native';
import { paymentService, PaymentMethod, PaymentRequest } from '../services/payment.service';
import { useAuthStore } from '../store/useAuthStore';

const { width } = Dimensions.get('window');

interface ReplenishWalletProps {
  onSuccess?: (newBalance: number) => void;
  onClose?: () => void;
}

export const ReplenishWallet: React.FC<ReplenishWalletProps> = ({
  onSuccess,
  onClose
}) => {
  const { user } = useAuthStore();
  
  // Состояние компонента
  const [amount, setAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [methodsLoading, setMethodsLoading] = useState<boolean>(true);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string>('');

  // Предустановленные суммы
  const presetAmounts = [100, 500, 1000, 2000, 5000];

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setMethodsLoading(true);
      const paymentMethods = await paymentService.getPaymentMethods();
      setMethods(paymentMethods);
      
      // Выбираем первый доступный метод по умолчанию
      const firstAvailable = paymentMethods.find(m => m.is_available);
      if (firstAvailable) {
        setSelectedMethod(firstAvailable);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить методы оплаты');
    } finally {
      setMethodsLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Удаляем все символы кроме цифр и точки
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Проверяем, что не больше одной точки
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Ограничиваем до 2 знаков после точки
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setAmount(cleanValue);
  };

  const handlePresetAmount = (presetAmount: number) => {
    setAmount(presetAmount.toString());
  };

  const calculateCommission = (): number => {
    if (!selectedMethod || !amount) return 0;
    return paymentService.calculateCommission(parseFloat(amount), selectedMethod);
  };

  const getTotalAmount = (): number => {
    if (!amount) return 0;
    return parseFloat(amount) + calculateCommission();
  };

  const validateForm = (): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Ошибка', 'Введите сумму пополнения');
      return false;
    }

    if (!selectedMethod) {
      Alert.alert('Ошибка', 'Выберите метод оплаты');
      return false;
    }

    const validation = paymentService.validateAmount(parseFloat(amount), selectedMethod);
    if (!validation.isValid) {
      Alert.alert('Ошибка', validation.error);
      return false;
    }

    // Проверка номера телефона для мобильных платежей
    if (['mobile_balance', 'elsom'].includes(selectedMethod.id) && !phoneNumber) {
      Alert.alert('Ошибка', 'Введите номер телефона');
      return false;
    }

    return true;
  };

  const handleReplenish = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const paymentRequest: PaymentRequest = {
        amount: parseFloat(amount),
        method: selectedMethod!.id,
        phone_number: phoneNumber || undefined
      };

      const response = await paymentService.replenishWallet(paymentRequest);

      if (response.status === 'success') {
        Alert.alert(
          'Успешно!',
          `Кошелек пополнен на ${paymentService.formatAmount(response.amount)}`,
          [
            {
              text: 'OK',
              onPress: () => {
                onSuccess?.(response.new_balance || 0);
                onClose?.();
              }
            }
          ]
        );
      } else {
        Alert.alert('Ошибка', response.error || 'Не удалось пополнить кошелек');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при пополнении кошелька');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.methodCard,
        selectedMethod?.id === method.id && styles.selectedMethodCard
      ]}
      onPress={() => setSelectedMethod(method)}
      disabled={!method.is_available}
    >
      <View style={styles.methodContent}>
        <Text style={[
          styles.methodName,
          !method.is_available && styles.disabledText
        ]}>
          {method.name}
        </Text>
        <Text style={[
          styles.methodCommission,
          !method.is_available && styles.disabledText
        ]}>
          Комиссия: {(method.commission_rate * 100).toFixed(1)}%
        </Text>
        <Text style={[
          styles.methodTime,
          !method.is_available && styles.disabledText
        ]}>
          {method.processing_time}
        </Text>
      </View>
      {selectedMethod?.id === method.id && (
        <View style={styles.selectedIndicator} />
      )}
    </TouchableOpacity>
  );

  if (methodsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Загрузка методов оплаты...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Пополнение кошелька</Text>
        <Text style={styles.subtitle}>Выберите сумму и метод оплаты</Text>
      </View>

      {/* Сумма пополнения */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Сумма пополнения</Text>
        
        <View style={styles.amountInputContainer}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0"
            keyboardType="numeric"
            maxLength={10}
          />
          <Text style={styles.currency}>сом</Text>
        </View>

        {/* Предустановленные суммы */}
        <View style={styles.presetContainer}>
          {presetAmounts.map((presetAmount) => (
            <TouchableOpacity
              key={presetAmount}
              style={[
                styles.presetButton,
                amount === presetAmount.toString() && styles.selectedPresetButton
              ]}
              onPress={() => handlePresetAmount(presetAmount)}
            >
              <Text style={[
                styles.presetText,
                amount === presetAmount.toString() && styles.selectedPresetText
              ]}>
                {presetAmount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Методы оплаты */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Метод оплаты</Text>
        {methods.map(renderPaymentMethod)}
      </View>

      {/* Номер телефона для мобильных платежей */}
      {selectedMethod && ['mobile_balance', 'elsom'].includes(selectedMethod.id) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Номер телефона</Text>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+996 XXX XXX XXX"
            keyboardType="phone-pad"
            maxLength={13}
          />
        </View>
      )}

      {/* Расчет комиссии */}
      {amount && selectedMethod && (
        <View style={styles.calculationContainer}>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Сумма:</Text>
            <Text style={styles.calculationValue}>
              {paymentService.formatAmount(parseFloat(amount))}
            </Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationLabel}>Комиссия:</Text>
            <Text style={styles.calculationValue}>
              {paymentService.formatAmount(calculateCommission())}
            </Text>
          </View>
          <View style={[styles.calculationRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Итого к списанию:</Text>
            <Text style={styles.totalValue}>
              {paymentService.formatAmount(getTotalAmount())}
            </Text>
          </View>
        </View>
      )}

      {/* Кнопка пополнения */}
      <TouchableOpacity
        style={[
          styles.replenishButton,
          (!amount || !selectedMethod || loading) && styles.disabledButton
        ]}
        onPress={handleReplenish}
        disabled={!amount || !selectedMethod || loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.replenishButtonText}>
            Пополнить кошелек
          </Text>
        )}
      </TouchableOpacity>

      {/* Модальное окно с QR-кодом */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Оплата через терминал</Text>
            <Text style={styles.modalSubtitle}>
              Отсканируйте QR-код в терминале
            </Text>
            {/* Здесь будет компонент QR-кода */}
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrText}>QR-код: {qrCode}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowQRModal(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  section: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  currency: {
    fontSize: 18,
    color: '#6C757D',
    marginLeft: 8,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  selectedPresetButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  presetText: {
    fontSize: 14,
    color: '#6C757D',
  },
  selectedPresetText: {
    color: '#FFFFFF',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  selectedMethodCard: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  methodContent: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  methodCommission: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  methodTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
  disabledText: {
    color: '#ADB5BD',
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  calculationContainer: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calculationLabel: {
    fontSize: 16,
    color: '#6C757D',
  },
  calculationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  replenishButton: {
    margin: 16,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ADB5BD',
  },
  replenishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: width * 0.9,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  qrText: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#6C757D',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ReplenishWallet;
