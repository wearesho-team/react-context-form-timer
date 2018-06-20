import * as PropTypes from "prop-types";
import { CancelTokenSource, AxiosError, AxiosResponse } from "axios";
import { InputContext, ModelError, InputContextTypes } from "react-context-form";

export interface AutoRequestProviderState {
    cancelToken?: CancelTokenSource;
}

export interface AutoRequestProviderProps {
    groupName: string;
    phoneLength?: number;
    onBeforeRequest?: () => void;
    onFailRequest?: (error: AxiosError) => void;
    onSuccessRequest?: (response?: AxiosResponse<any>) => void;
    request: (cancelToken: CancelTokenSource) => Promise<any>;
}

export const AutoRequestProviderPropTypes: {[P in keyof AutoRequestProviderProps]: PropTypes.Validator<any>} = {
    phoneLength: PropTypes.number,
    onFailRequest: PropTypes.func,
    onBeforeRequest: PropTypes.func,
    onSuccessRequest: PropTypes.func,
    request: PropTypes.func.isRequired,
    groupName: PropTypes.string.isRequired
};

export const AutoRequestProviderDefaultProps: {[P in keyof AutoRequestProviderProps]?: AutoRequestProviderProps[P]} = {
    phoneLength: 12
};

export interface AutoRequestProviderContext {
    readonly value?: string;
    readonly addError: (newError: ModelError) => void;
    readonly getError: (attribute: string) => ModelError | undefined;
    readonly getDOMElement: (attribute: string) => HTMLElement | undefined;
}

export const AutoRequestProviderContextTypes: {[P in keyof AutoRequestProviderContext]: PropTypes.Validator<any>} = {
    value: PropTypes.string,
    getError: PropTypes.func.isRequired,
    addError: PropTypes.func.isRequired,
    getDOMElement: PropTypes.func.isRequired
};
