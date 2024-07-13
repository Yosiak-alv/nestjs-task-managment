import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

export function Match(options: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'Match',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: MatchConstraint,
        });
    };
}

@ValidatorConstraint({name: 'MatchConstraint'})
export class MatchConstraint implements ValidatorConstraintInterface {

    validate(value: any, args?: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return value === relatedValue;
    }

    defaultMessage(args?: ValidationArguments): string {
        const [relatedPropertyName] = args.constraints;
        return `${relatedPropertyName} and ${args.property} do not match`;
    }

}