module.exports = function (nodecg) {

    return {
        MessageNames: {
            tips: {
                newTip: 'tips-new',
                newHighestTip: 'tips-new-highest'
            }
        },
        ReplicantData: {
            highestTip: {
                user: nodecg.Replicant('HighestTipUser', {defaultValue: 'Joviex'}),
                amount: nodecg.Replicant('HighestTipAmount', {defaultValue: 30}),
                note: nodecg.Replicant('HighestTipNote', {defaultValue: 'Unknown'}),
            },
            lastTip: {
                user: nodecg.Replicant('LastTipUser', {defaultValue: 'Kitatus'}),
                amount: nodecg.Replicant('LastTipAmount', {defaultValue: 5}),
                note: nodecg.Replicant('LastTipNote', {defaultValue: 'Bribing you for a slot in Pumpkin Hack. GG dude.'}),
            },
            sessionTips: {
                tipSummary: nodecg.Replicant('SessionTips', {defaultValue: [], persistent: false}),
                amount: nodecg.Replicant('SessionTipAmount', {defaultValue: 0, persistent: false}),
            }
        }
    };
}