/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type BookCreateFormInputValues = {
    title?: string;
    description?: string;
    image?: string;
    pdfdoc?: string;
    author?: string;
    featured?: boolean;
    price?: number;
};
export declare type BookCreateFormValidationValues = {
    title?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    image?: ValidationFunction<string>;
    pdfdoc?: ValidationFunction<string>;
    author?: ValidationFunction<string>;
    featured?: ValidationFunction<boolean>;
    price?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BookCreateFormOverridesProps = {
    BookCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    image?: PrimitiveOverrideProps<TextFieldProps>;
    pdfdoc?: PrimitiveOverrideProps<TextFieldProps>;
    author?: PrimitiveOverrideProps<TextFieldProps>;
    featured?: PrimitiveOverrideProps<SwitchFieldProps>;
    price?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BookCreateFormProps = React.PropsWithChildren<{
    overrides?: BookCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: BookCreateFormInputValues) => BookCreateFormInputValues;
    onSuccess?: (fields: BookCreateFormInputValues) => void;
    onError?: (fields: BookCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BookCreateFormInputValues) => BookCreateFormInputValues;
    onValidate?: BookCreateFormValidationValues;
} & React.CSSProperties>;
export default function BookCreateForm(props: BookCreateFormProps): React.ReactElement;
