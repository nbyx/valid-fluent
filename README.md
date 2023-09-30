# Fluent Validation Builder for TypeScript 💡
**Elegant and type-safe model validation made easy.**

## Overview 🌐
Tired of unreadable and messy model validation logic? Meet valid-fluent Builder! Leverage the power of TypeScript and clean code principles to write clear, expressive, and type-safe validation rules for your application models.

## Features 🌟
- Fluent API design for easy readability
- Full TypeScript support for strong type safety
- Flexible and extensible
- Supports conditional validation
- Supports synchronous and asynchronous validation
- Optional "fail fast" mode to stop validation on first error
- In-built type-checking methods for common types (Number, String, Boolean, Date, and more)

## Installation 📦
```bash
npm install valid-fluent
```

## Basic Usage 🚀
Import the main ValidationBuilder class and start building your validation logic.
```typescript
import { ValidationBuilder } from 'valid-fluent';

const validation = ValidationBuilder.create<User>()
  .forField('username', u => u.username)
  .addRule(({value}) => value !== '')
  .withMessage('Username is required')
  .build();

const result = validation.validate(user);
```

## Type-Checking and Type-Specific Methods
Valid-Fluent now incorporates handy methods for validating common data types. Additionally, when you specify a data type using **isNumber**, **isString**, **isBoolean**, or **isDate**, you unlock type-specific validation methods for that field. Here's how to use them:

```typescript

const validation = ValidationBuilder.create<User>()
    
.forField('age', u => u.age)
    .isNumber()
    .withMessage('Must be number')
    .isGreaterThan(18)
    .withMessage('You must be over 18')
.forField('email', u => u.email)
    .isString()
    .withMessage('Must be string')
    .matches(/@/)
    .withMessage('Email must contain "@"')
.forField('isActive', u => u.isActive)
    .isBoolean()
    .withMessage('Must be boolean')
    .isTrue()
    .withMessage('You must be active')
.build();
```

These methods not only ensure the correct data type but also provide a fluent and expressive way to define further validation rules based on the data type.

## Async Validation
Asynchronous validators can be added just like regular validators. They should return a Promise.
```typescript
const asyncValidation = ValidationBuilder.create<User>()
  .forField('username', u => u.username)
  .addRule(async ({value}) => {
    const userExists = await checkUserExists(value);
    return !userExists;
  })
  .withMessage('Username already exists')
  .build();

const asyncResult = await asyncValidation.validateAsync(user);
```

## Core Concepts
The entry point for creating validations. Start by calling 
```typescript
ValidationBuilder.create<ModelType>()
```

Use **.forField()** method to specify the property you want to validate.

```typescript
builder.forField('email', u => u.email)
```

Once you've added a rule, you can attach an error message using **.withMessage()**. 

```typescript
builder.addRule(emailValidator)
.withMessage('Invalid email!')
```
You can also pass a function to `withMessage` to dynamically generate error messages based on the model's current state.
```typescript
builder.forField('age', u => u.age)
.addRule(({ value }) => value >= 18)
.withMessage(model => `Must be at least 18 years old, but got ${model.age}.`);
```
In the dynamic error message example above, if the age field validation fails, the error message will reflect the actual age value from the model, providing a more descriptive error message.

### Conditional Rules
Conditional rules enable dynamic validations. Use **.when()** to conditionally apply a validation rule.

```typescript
builder.addRule(emailValidator)
.when(model => model.subscribeToNewsletter)
```

You can also add a condition to multiple validation rules by using the builder callback provided by when:
```typescript
builder.when(model => model.subscribeToNewsletter, builder =>
  builder
      .forField('email', u => u.email)
        .addRule(emailValidator)
        .withMessage('Invalid email!')
      .forField('age', u => u.age)
        .addRule(ageValidator)
        .withMesasge('You are not old enough'));
```

## Dependent Field Validation
To include a dependent field in validation, use the **.dependsOn()** method.

```typescript
builder.forField('passwordConfirmation', u => u.passwordConfirmation)
.dependsOn(u => u.password)
```
## Custom Validators
You can create custom validation rules by passing your own validator functions to **.addRule()**.

```typescript
const emailValidator = args => {
  const { value } = args;

  return value.includes('@');
};

builder.addRule(emailValidator)
```

You could also do this inline:

```typescript
builder
    .forField('email', model => model.email)
    .addRule(args => {
      const { value } = args;
    
      return value.includes('@')
})
```

You can use the **ValidatorArgs**-type to type your validator.

## Handling Validation Outcomes 🔍

Once you've defined your validation rules and run the validation, you'll receive a `ValidationOutcome` object. This object will be of type `ValidationSuccess` if the validation passes, or `ValidationError` if it fails. Here's how you can use this object to inspect any validation errors:

```typescript
const outcome = validation.validate(user);

if (!outcome.isValid) {
    // Validation failed
    const passwordError = outcome.result.password;
    console.error(`${passwordError.propertyName}: ${passwordError.message}`);
    // Output: password: Password must match username for some reason
}
```
In the ValidationError object, the result field contains a ValidationResult object where each key is the name of a field in your model, and the value is an object containing the field's name and the validation error message.

Here's a more structured example using a test suite:
```typescript
test('should validate password', () => {
    const outcome = validation.validate(user);
    
    if (!outcome.isValid) {
        expect(outcome.result.password.propertyName).toBe('password');
        expect(outcome.result.password.message).toBe('Password must match username for some reason');
    }
});
```
This structure allows you to easily access validation error messages and the corresponding field names, making error handling and reporting straightforward and type-safe.

## Upcoming Features
- [x] Async Validators
- [ ] Validation Result Transformation
- [ ] Custom Validation Error Handling
- [ ] Validation Groups
- [ ] Integration with Popular Libraries/Frameworks

## Contributing 🤝
Feel free to contribute by opening issues, sending pull requests, or just by sharing your thoughts on making this package better.

## License 📜
MIT License.
