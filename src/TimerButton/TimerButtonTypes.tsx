import * as React from "react";
import * as PropTypes from "prop-types";

export interface TimerButtonProps extends React.HTMLProps<HTMLButtonElement> {
    timerIcon?: JSX.Element;
    onTimeout?: () => void;
    waitTime?: number;
}

export interface TimerButtonContext {
    getStopTimerHandler: (handler: () => void) => void;
    getStartTimerHandler: (handler: () => void) => void;
    onTimeout: () => void;
    onClick: () => void;
    disabled: boolean;
}

export const TimerButtonContextTypes: {[P in keyof TimerButtonContext]: PropTypes.Validator<any>} = {
    getStartTimerHandler: PropTypes.func.isRequired,
    getStopTimerHandler: PropTypes.func.isRequired,
    onTimeout: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export const TimerButtonPropTypes: {[P in keyof TimerButtonProps]: PropTypes.Validator<any>} = {
    timerIcon: PropTypes.element,
    waitTime: PropTypes.number,
    onTimeout: PropTypes.func
};

export const TimerButtonDefaultProps: {[P in keyof TimerButtonProps]?: TimerButtonProps[P]} = {
    timerIcon: <i className="icon icon-sms" />,
    type: "button",
    waitTime: 30
};
