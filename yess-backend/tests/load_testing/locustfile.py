from locust import HttpUser, task, between
import json

class YessLoyaltyUser(HttpUser):
    """
    Симуляция пользователей YESS Loyalty
    """
    wait_time = between(1, 3)  # Случайная пауза между запросами
    host = "http://localhost:8000"  # Базовый URL сервера

    def on_start(self):
        """
        Подготовка к тестированию: авторизация
        """
        self.login()

    def login(self):
        """
        Имитация входа в систему
        """
        login_data = {
            "username": "test_user",
            "password": "test_password"
        }
        response = self.client.post(
            "/api/v1/auth/login", 
            json=login_data
        )
        if response.status_code == 200:
            self.token = response.json()['access_token']
            self.client.headers.update({
                'Authorization': f'Bearer {self.token}'
            })

    @task(3)  # Высокий приоритет
    def get_nearby_partners(self):
        """
        Тест получения ближайших партнеров
        """
        self.client.get("/api/v1/partners/nearby", params={
            "latitude": 42.8746,
            "longitude": 74.5698,
            "radius": 10
        })

    @task(2)  # Средний приоритет
    def view_partner_details(self):
        """
        Тест просмотра деталей партнера
        """
        partner_id = 1  # Тестовый ID партнера
        self.client.get(f"/api/v1/partners/{partner_id}")

    @task(1)  # Низкий приоритет
    def create_transaction(self):
        """
        Тест создания транзакции
        """
        transaction_data = {
            "partner_id": 1,
            "amount": 1000,
            "yess_coins": 2000
        }
        self.client.post("/api/v1/transactions", json=transaction_data)

# Конфигурация нагрузочного тестирования
class LoadTestConfig:
    """
    Конфигурация для различных сценариев нагрузки
    """
    SCENARIOS = {
        "light_load": {
            "users": 50,
            "spawn_rate": 5,
            "duration": 300  # 5 минут
        },
        "medium_load": {
            "users": 200,
            "spawn_rate": 20,
            "duration": 600  # 10 минут
        },
        "high_load": {
            "users": 500,
            "spawn_rate": 50,
            "duration": 900  # 15 минут
        }
    }

    @classmethod
    def generate_report(cls, scenario_name, results):
        """
        Генерация отчета о нагрузочном тестировании
        """
        report = {
            "scenario": scenario_name,
            "total_users": cls.SCENARIOS[scenario_name]["users"],
            "duration": cls.SCENARIOS[scenario_name]["duration"],
            "response_times": {
                "average": results.get('response_time_avg', 0),
                "min": results.get('response_time_min', 0),
                "max": results.get('response_time_max', 0)
            },
            "requests": {
                "total": results.get('num_requests', 0),
                "failures": results.get('num_failures', 0)
            }
        }
        
        # Сохранение отчета
        with open(f"load_test_report_{scenario_name}.json", "w") as f:
            json.dump(report, f, indent=2)

        return report
