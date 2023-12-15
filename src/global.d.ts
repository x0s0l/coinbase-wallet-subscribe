export { };
declare global {
    interface Window {
        CBWSubscribe: {
            createSubscriptionUI: (args: {
                partnerAddress: string,
                partnerName: string,
                modalTitle: string,
                modalBody: any
                onSubscriptionChange: (value: boolean) => void
                onLoading: (value: boolean) => void
            }) => void
            toggleSubscription: () => void
        }
    }
};
