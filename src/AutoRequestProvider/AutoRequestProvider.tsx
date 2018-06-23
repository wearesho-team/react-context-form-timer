import * as React from "react";
import * as PropTypes from "prop-types";
import { addError, FormContext } from "react-context-form";
import Axios, { CancelTokenSource, AxiosError, AxiosResponse } from "axios";

import { TimerButtonContextTypes, TimerButtonContext } from "../TimerButton";
import { PhoneValidatorContextTypes, PhoneValidatorContext } from "../PhoneValidator";
import {
    AutoRequestProviderProps,
    AutoRequestProviderState,
    AutoRequestProviderContext,
    AutoRequestProviderPropTypes,
    AutoRequestProviderDefaultProps,
    AutoRequestProviderContextTypes
} from "./AutoRequestProviderTypes";

export class AutoRequestProvider extends React.Component<AutoRequestProviderProps, AutoRequestProviderState> {
    public static readonly defaultProps = AutoRequestProviderDefaultProps;
    public static readonly contextTypes = AutoRequestProviderContextTypes;
    public static readonly propTypes = AutoRequestProviderPropTypes;
    public static readonly childContextTypes = {
        ...PhoneValidatorContextTypes,
        ...TimerButtonContextTypes
    };

    public readonly state: AutoRequestProviderState = {
        isValid: false
    };
    public readonly context: AutoRequestProviderContext;

    protected stopTimer?: () => void;
    protected startTimer?: () => void;

    public getChildContext(): PhoneValidatorContext & TimerButtonContext {
        return {
            getStartTimerHandler: this.getStartTimerHandler,
            getStopTimerHandler: this.getStopTimerHandler,
            requestSmsToken: this.requestSmsToken,
            disabled: this.shouldTimerBeDisabled,
            onValidated: this.handleValidated,
            onValidate: this.handleValidate,
            groupName: this.props.groupName,
            onTimeout: this.cancelRequest
        };
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    public componentWillUnmount() {
        this.state.cancelToken && this.state.cancelToken.cancel();
    }

    protected getStopTimerHandler = (handler: () => void): void => {
        this.stopTimer = handler;
    }

    protected getStartTimerHandler = (handler: () => void): void => {
        this.startTimer = handler;
    }

    protected requestSmsToken = async () => {
        if (this.state.cancelToken || (this.startTimer && !this.startTimer())) {
            return;
        }

        this.state.cancelToken = Axios.CancelToken.source();
        this.forceUpdate();

        this.props.onBeforeRequest && this.props.onBeforeRequest();

        let response: AxiosResponse<any>;
        try {
            response = await this.props.request(this.state.cancelToken);
        } catch (error) {
            this.stopTimer && this.stopTimer();
            this.props.onFailRequest && this.props.onFailRequest(error);
            this.setState({ cancelToken: undefined });
            addError(this.context as FormContext, error);
            return;
        }

        this.stopTimer && this.stopTimer();
        this.props.onSuccessRequest && this.props.onSuccessRequest(response);
        this.setState({ cancelToken: undefined });
    }

    protected handleValidate = (nextValue: string, prevValue: string): boolean => {
        const shouldRequestBeCanceled =
            this.filterPhone(nextValue).length !== this.props.phoneLength
            && this.filterPhone(prevValue).length === this.props.phoneLength;

        shouldRequestBeCanceled && this.cancelRequest();

        return this.filterPhone(nextValue).length === this.props.phoneLength
            && this.filterPhone(prevValue).length !== this.props.phoneLength;
    }

    protected get shouldTimerBeDisabled(): boolean {
        return !!this.context.getError(this.props.groupName)
            || this.filterPhone(this.context.value).length !== this.props.phoneLength;
    }

    protected handleValidated = (isValid: boolean): void => {
        if (this.state.isValid === isValid) {
            return;
        }

        this.setState({ isValid });
        isValid && this.requestSmsToken();
    }

    protected cancelRequest = (): void => {
        this.state.cancelToken && this.state.cancelToken.cancel();
        this.setState({ cancelToken: undefined });
        this.stopTimer && this.stopTimer();
    }

    private filterPhone = (value?: string): string => {
        return value
            ? value.replace(/\D/g, "")
            : "";
    }
}
