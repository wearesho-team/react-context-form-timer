import * as PropTypes from "prop-types";

export interface PhoneValidatorProps {
    children: JSX.Element;
}

export interface PhoneValidatorContext {
    onValidate: (nextValue: string, prevValue: string) => boolean;
    onValidated: (valid: boolean) => void;
    groupName: string;
}

export const PhoneValidatorContextTypes: {[P in keyof PhoneValidatorContext]: PropTypes.Validator<any>} = {
    onValidated: PropTypes.func.isRequired,
    groupName: PropTypes.string.isRequired,
    onValidate: PropTypes.func.isRequired
};

export const PhoneValidatorPropTypes: {[P in keyof PhoneValidatorProps]: PropTypes.Validator<any>} = {
    children: PropTypes.element.isRequired
};
