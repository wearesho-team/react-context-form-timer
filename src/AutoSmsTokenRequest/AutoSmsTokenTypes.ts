import * as PropTypes from "prop-types";
import { CancelTokenSource } from "axios";
import { InputContext, ModelError, InputContextTypes } from "react-context-form";

export interface AutoSmsTokenRequestState {
    cancelToken?: CancelTokenSource;
}

export interface AutoSmsTokenRequestProps {
    groupName: string;
    phoneLength?: number;

    onFailRequest?: () => void;
    onBeforeRequest?: () => void;
    onSuccessRequest?: () => void;
    request: (cancelToken: CancelTokenSource) => Promise<any>;
}

export const AutoSmsTokenRequestPropTypes: {[P in keyof AutoSmsTokenRequestProps]: PropTypes.Validator<any>} = {
    phoneLength: PropTypes.number,

    onFailRequest: PropTypes.func,
    onBeforeRequest: PropTypes.func,
    onSuccessRequest: PropTypes.func,
    request: PropTypes.func.isRequired,

    groupName: PropTypes.string.isRequired,
};

export const AutoSmsTokenRequestDefaultProps: {[P in keyof AutoSmsTokenRequestProps]?: AutoSmsTokenRequestProps[P]} = {
    phoneLength: 12
};

export interface AutoSmsTokenRequestContext {
    readonly value?: string;
    readonly addError: (newError: ModelError) => void;
    readonly getError: (attribute: string) => ModelError | undefined;
    readonly getDOMElement: (attribute: string) => HTMLElement | undefined;
}

export const AutoSmsTokenRequestContextTypes: {[P in keyof AutoSmsTokenRequestContext]: PropTypes.Validator<any>} = {
    value: PropTypes.string,
    getError: PropTypes.func.isRequired,
    addError: PropTypes.func.isRequired,
    getDOMElement: PropTypes.func.isRequired
};
