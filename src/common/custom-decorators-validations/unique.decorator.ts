import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { EntityManager } from 'typeorm';

export type IsUniqueConstraintInput = {
    tableName: string,
    column: string
}

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly entityManager: EntityManager) {}
    async validate(
        value: any, 
        args?: ValidationArguments
    ): Promise<boolean> {
        const {tableName, column}: IsUniqueConstraintInput = args.constraints[0];

        const result = await this.entityManager
        .getRepository(tableName)
        .createQueryBuilder()
        .where({ [column]: value })
        .getExists();

        return !result;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const field: string = validationArguments.property
        return `${field} already exists`;
    }
}

export function IsUnique(options: IsUniqueConstraintInput,validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'is-unique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueConstraint,
        })
    }
}