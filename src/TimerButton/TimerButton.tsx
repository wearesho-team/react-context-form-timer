import * as React from "react";
import * as PropTypes from "prop-types";

import {
    TimerButtonContextTypes,
    TimerButtonDefaultProps,
    TimerButtonPropTypes,
    TimerButtonContext,
    TimerButtonProps
} from "./TimerButtonTypes";

export interface TimerButtonState {
    tick: number;
}

export class TimerButton extends React.Component<TimerButtonProps, TimerButtonState> {
    public static readonly defaultProps = TimerButtonDefaultProps;
    public static readonly contextTypes = TimerButtonContextTypes;
    public static readonly propTypes = TimerButtonPropTypes;

    public readonly context: TimerButtonContext;

    constructor(props, context: TimerButtonContext) {
        super(props, context);

        this.state = {
            tick: props.waitTime
        };

        context.getStopTimerHandler(this.stopTimer);
        context.getStartTimerHandler(this.startTimer);
    }

    protected timerId: any = undefined;

    public componentWillUnmount() {
        clearTimeout(this.timerId);
    }

    public render(): React.ReactNode {
        const { waitTime, disabled, timerIcon, onClick, ...buttonProps } = this.props;

        return (
            <button
                {...buttonProps}
                onClick={this.handleClick}
                disabled={this.timerId !== undefined || this.context.disabled || disabled}
            >
                {this.InnerLayout}
            </button>
        );
    }

    protected handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClick && this.props.onClick(event);

        this.context.onClick();
    }

    protected startTimer = (): void => {
        clearTimeout(this.timerId);
        this.timerId = setTimeout(this.tick, 1000);
    }

    protected stopTimer = (): void => {
        clearTimeout(this.timerId);
        this.timerId = undefined;

        this.setState({
            tick: this.props.waitTime
        });
    }

    protected tick = (): void => {
        if (!this.state.tick) {
            this.context.onTimeout();
            this.props.onTimeout && this.props.onTimeout();
            return this.stopTimer();
        }

        this.setState(({ tick }) => ({
            tick: tick - 1
        }), this.startTimer);
    }

    protected get InnerLayout(): JSX.Element {
        return this.timerId !== undefined
            ? <span>{this.state.tick}</span>
            : this.props.timerIcon
    }
}
