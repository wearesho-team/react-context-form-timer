import * as React from "react";
import { AutoValidate } from "react-context-form";

import {
    PhoneValidatorProps,
    PhoneValidatorContext,
    PhoneValidatorPropTypes,
    PhoneValidatorContextTypes
} from "./PhoneValidatorTypes";

export class PhoneValidator extends React.Component<PhoneValidatorProps> {
    public static readonly contextTypes = PhoneValidatorContextTypes;
    public static readonly propTypes = PhoneValidatorPropTypes;

    public readonly context: PhoneValidatorContext;

    public render(): React.ReactNode {
        return (
            <AutoValidate
                onBlur={false}
                on={this.context.onValidate}
                groupName={this.context.groupName}
                onValidated={this.context.onValidated}
            >
                {this.props.children}
            </AutoValidate>
        );
    }
}
