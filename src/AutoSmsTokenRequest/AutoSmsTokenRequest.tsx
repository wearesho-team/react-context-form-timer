import * as React from "react";
import * as PropTypes from "prop-types";
import axios, { CancelTokenSource } from "axios";
import { AutoValidate, addError, FormContext } from "react-context-form";

import {
    AutoSmsTokenRequestState,
    AutoSmsTokenRequestProps,
    AutoSmsTokenRequestContext,
    AutoSmsTokenRequestPropTypes,
    AutoSmsTokenRequestDefaultProps,
    AutoSmsTokenRequestContextTypes
} from "./AutoSmsTokenTypes";
import { TimerButtonContext, TimerButtonContextTypes } from "../TimerButton";

export class AutoSmsTokenRequest extends React.Component<AutoSmsTokenRequestProps, AutoSmsTokenRequestState> {
    public static readonly defaultProps = AutoSmsTokenRequestDefaultProps;
    public static readonly contextTypes = AutoSmsTokenRequestContextTypes;
    public static readonly childContextTypes = TimerButtonContextTypes;
    public static readonly propTypes = AutoSmsTokenRequestPropTypes;

    public readonly context: AutoSmsTokenRequestContext;

    public state: AutoSmsTokenRequestState = {};

    protected stopTimer?: () => void;
    protected startTimer?: () => void;

    public getChildContext(): TimerButtonContext {
        return {
            getStartTimerHandler: this.getStartTimerHandler,
            getStopTimerHandler: this.getStopTimerHandler,
            disabled: this.shouldTimerBeDisabled,
            onTimeout: this.cancelRequest,
            onClick: this.requestSmsToken
        };
    }

    public componentWillUnmount() {
        this.state.cancelToken && this.state.cancelToken.cancel();
    }

    public render(): React.ReactNode {
        return (
            <AutoValidate
                onBlur={false}
                on={this.handleValidate}
                groupName={this.props.groupName}
                onValidated={this.handleValidated}
            >
                {this.props.children as JSX.Element}
            </AutoValidate>
        );
    }

    protected getStopTimerHandler = (handler: () => void): void => {
        this.stopTimer = handler;
    }

    protected getStartTimerHandler = (handler: () => void): void => {
        this.startTimer = handler;
    }

    protected requestSmsToken = async () => {
        if (this.state.cancelToken) {
            return;
        }

        this.startTimer && this.startTimer();
        this.state.cancelToken = axios.CancelToken.source();
        this.forceUpdate();

        this.props.onBeforeRequest && this.props.onBeforeRequest();

        try {
            await this.props.request(this.state.cancelToken);
        } catch (error) {
            this.stopTimer && this.stopTimer();
            this.props.onFailRequest && this.props.onFailRequest();
            this.setState({ cancelToken: undefined });
            addError(this.context as FormContext, error);
            return;
        }

        this.stopTimer && this.stopTimer();
        this.props.onSuccessRequest && this.props.onSuccessRequest();
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

    protected handleValidated = (valid: boolean): void => {
        valid && this.requestSmsToken();
    }

    protected cancelRequest = (): void => {
        this.state.cancelToken && this.state.cancelToken.cancel();
        this.setState({ cancelToken: undefined });
        this.stopTimer && this.stopTimer();
    }

    private filterPhone = (value: string): string => {
        return value.replace(/\D/g, "");
    }
}
