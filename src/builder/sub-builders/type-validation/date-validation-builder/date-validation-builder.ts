import {CommonBuilder} from "../../common-builder/common-builder";
import {NestedPropGetter, SharedBuilderState, ValidationType, Validator} from "../../../../types/validation.types";
import {ForFieldAddedBuilder} from "../../for-field-added-builder/for-field-added-builder";
import {InitialBuilder} from "../../initial-builder/initial-builder";

export class DateValidationBuilder<ModelType, DependentFieldType, DependsOnCalled extends boolean, IsAsync extends boolean> {

    constructor(private readonly sharedState: SharedBuilderState<
        ModelType,
        Date,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'Date'
    >) {
    }

    forField<NewFieldType>(
        name: Extract<keyof ModelType, string>,
        propGetter: NestedPropGetter<ModelType, NewFieldType>,
    ): ForFieldAddedBuilder<ModelType, NewFieldType, DependentFieldType, DependsOnCalled, IsAsync> {
        return new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync>({...this.sharedState as unknown as SharedBuilderState<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, null>}).forField(name, propGetter);
    }

    when<Field, DependentField>(
        condition: (model: ModelType) => boolean,
        builderCallback?: (
            builder: InitialBuilder<ModelType>,
        ) => CommonBuilder<ModelType, Field, DependentField, DependsOnCalled, IsAsync>,
    ): CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync> {
        return new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync>({...this.sharedState as unknown as SharedBuilderState<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, null>}).when(condition, builderCallback);
    }

    addRule<V extends Validator<ModelType, Date, DependentFieldType, DependsOnCalled>>(
        validator: V,
        condition?: (model: ModelType) => boolean,
    ) {
        return new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync>({...this.sharedState as unknown as SharedBuilderState<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, null>}).addRule(validator, condition);
    }

    build(): ValidationType<ModelType, IsAsync> {
        return new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync>({...this.sharedState as unknown as SharedBuilderState<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, null>}).build();
    }

    isBefore(date: Date){
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => value < date);
    }

    isAfter(date: Date){
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => value > date);
    }

    isBetween(startDate: Date, endDate: Date){
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => value >= startDate && value <= endDate);
    }

    isSameDay(date: Date){
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) =>
            value.getFullYear() === date.getFullYear() &&
            value.getMonth() === date.getMonth() &&
            value.getDate() === date.getDate()
        );
    }

    isWeekend(){
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) =>
            value.getDay() === 0 || value.getDay() === 6
        );
    }

    isWeekday(){
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) =>
            value.getDay() >= 1 && value.getDay() <= 5
        );
    }

    isToday(){
        const today = new Date();
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) =>
            value.getFullYear() === today.getFullYear() &&
            value.getMonth() === today.getMonth() &&
            value.getDate() === today.getDate()
        );
    }

    isPast(){
        const now = new Date();
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => value < now);
    }

    isFuture(){
        const now = new Date();
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => value > now);
    }

    isLeapYear(){
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) =>
            (value.getFullYear() % 4 === 0 && value.getFullYear() % 100 !== 0) ||
            (value.getFullYear() % 400 === 0)
        );
    }

    isSameMonth(date: Date){
        const commonBuilder = new CommonBuilder<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>(this.sharedState)

        return commonBuilder.addRule(({ value }) =>
            value.getFullYear() === date.getFullYear() &&
            value.getMonth() === date.getMonth()
        );
    }
}