# Fluent Validation Builder for TypeScript 💡
**Elegant and type-safe model validation made easy.**

## Overview 🌐
Tired of unreadable and messy model validation logic? Meet valid-fluent Builder! Leverage the power of TypeScript and clean code principles to write clear, expressive, and type-safe validation rules for your application models.

## Features 🌟
- Fluent API design for easy readability
- Full TypeScript support for strong type safety
- Flexible and extensible
- Supports conditional validation
- Optional "fail fast" mode to stop validation on first error

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

### Conditional Rules
Conditional rules enable dynamic validations. Use **.when()** to conditionally apply a validation rule.

```typescript
builder.addRule(emailValidator)
.when(model => model.subscribeToNewsletter)
```

You can also add a condition to multiple validation rules by using the builder callback provided by when:
```typescript
builder.when(model => model.subscribeToNewsletter, builder =>
  builder.forField('email', u => u.email)
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
Custom Validators
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
builder.forField('email', model => model.email).addRule(args => {
  const { value } = args;

  return value.includes('@')
})
```

You can use the **ValidatorArgs**-type to type your validator.

## Upcoming Features
- [ ] Validation Result Transformation
- [ ] Async Validators
- [ ] Custom Validation Error Handling
- [ ] Validation Groups
- [ ] Integration with Popular Libraries/Frameworks

## Contributing 🤝
Feel free to contribute by opening issues, sending pull requests, or just by sharing your thoughts on making this package better.

## License 📜
MIT License.
