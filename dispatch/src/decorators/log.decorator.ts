function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey} with arguments:`, args);
        return originalMethod.apply(this, args);
    };
}