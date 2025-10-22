import { makeAutoObservable } from 'mobx';

// Интерфейс для сервисов
interface ServiceConstructor<T> {
    new (...args: any[]): T;
}

class DependencyInjectionContainer {
    private services: Map<string, any> = new Map();
    private singletons: Map<string, any> = new Map();

    constructor() {
        makeAutoObservable(this);
    }

    // Регистрация сервиса
    register<T>(
        key: string | ServiceConstructor<T>, 
        service: T | ServiceConstructor<T>, 
        options: { 
            singleton?: boolean, 
            dependencies?: any[] 
        } = {}
    ) {
        const serviceKey = typeof key === 'string' ? key : key.name;
        
        if (typeof service === 'function') {
            // Если передан конструктор
            this.services.set(serviceKey, {
                constructor: service,
                singleton: options.singleton || false,
                dependencies: options.dependencies || []
            });
        } else {
            // Если передан готовый экземпляр
            if (options.singleton) {
                this.singletons.set(serviceKey, service);
            } else {
                this.services.set(serviceKey, {
                    instance: service,
                    singleton: false
                });
            }
        }
    }

    // Получение сервиса
    get<T>(key: string | ServiceConstructor<T>): T {
        const serviceKey = typeof key === 'string' ? key : key.name;
        
        // Проверка синглтонов
        const singleton = this.singletons.get(serviceKey);
        if (singleton) return singleton;

        // Получение сервиса
        const service = this.services.get(serviceKey);
        
        if (!service) {
            throw new Error(`Service ${serviceKey} not found`);
        }

        // Если уже есть экземпляр
        if (service.instance) {
            return service.instance;
        }

        // Создание экземпляра с зависимостями
        const dependencies = service.dependencies 
            ? service.dependencies.map(dep => this.get(dep)) 
            : [];
        
        const instance = new service.constructor(...dependencies);

        // Кэширование синглтона
        if (service.singleton) {
            this.singletons.set(serviceKey, instance);
        }

        return instance;
    }

    // Удаление сервиса
    remove(key: string) {
        this.services.delete(key);
        this.singletons.delete(key);
    }

    // Очистка всех сервисов
    clear() {
        this.services.clear();
        this.singletons.clear();
    }
}

// Создание глобального контейнера
export const DIContainer = new DependencyInjectionContainer();

// Декоратор для внедрения зависимостей
export function Inject(serviceKey: string | Function) {
    return function(
        target: any, 
        propertyKey: string, 
        descriptor?: PropertyDescriptor
    ) {
        // Логика внедрения зависимостей
        return {
            get() {
                return DIContainer.get(serviceKey);
            }
        };
    };
}

export default DIContainer;
