# React context form timer

## Usage

```tsx
<AutoRequestProvider
    phoneLength={12}
    groupName="phone"
    onBeforeRequest={() => console.log("Sending sms...")}
    onFailRequest={(error: AxiosError) => console.log(error)}
    onSuccessRequest={(response: AxiosResponse<any>) => console.log(response)}
    request={(cancelToken: CancelTokenSource): Promise<any> => axios.get("/api", { cancelToken: cancelToken.token() })}
>
    <PhoneValidator>
        <Input />
    </PhoneValidator>
    <TimerButton
        waitTime={30}
        disabled={this.state.disabled}
        timerIcon={<i className="icon icon-sms"/>}
        onTimeout={() => console.log("Time is over")}
    />
</AutoRequestProvider>
```

where
- `phoneLength` - length of string of phone. Optional. Default = `12`.
- `groupName` - name of validation group.
- `onSuccessRequest` - will call if sms request was succefull. Optional.
- `onFailRequest` - will call if sms request was failed. Optional.
- `onBeforeRequest` - will call before request. Optional.
- `request` - will call on request.
- `waitTime` - count of seconds. Optional. Default = `30`.
- `timerIcon` - markup, that rendered on unactive timer. Optional. Default = `<i className="icon icon-sms"/>`
- `onTimeout` - will call when time is over. Optional.
- `disabled` - control of auto sending. Optional.

*Note: When `disabled` will change value from `false` to `true`, provider will try to do request
