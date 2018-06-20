# React context form timer

## Usage

```tsx
<AutoSmsTokenRequest
    phoneLength={12}
    groupName="phone"
    onSuccessRequest={() => console.log("Success")}
    onBeforeRequest={() => console.log("Sending sms...")}
    onFailRequest={(error: AxiosError) => console.log(error)}
    request={(cancelToken: CancelTokenSource): Promise<any> => axios.get("/api", { cancelToken: cancelToken.token() })}
>
    // Markup...
    <TimerButton
        waitTime={30}
        timerIcon={<i className="icon icon-sms"/>}
        onTimeout={() => console.log("Timer is over")}
    />
</AutoSmsTokenRequest>
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
