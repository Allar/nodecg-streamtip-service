'use strict';

module.exports = function (nodecg) {

    var RepsAndNames = require('./reps-and-names.js')(nodecg);
    var request = require('request-json');

    try {
        if (nodecg.bundleConfig.streamtip_client_id == null || nodecg.bundleConfig.streamtip_access_token == null) {
            console.error('Could not load Streamtip Service. Config invalid.');
            return;
        }
    } catch (e) {
        console.error('Could not load Streamtip Service. Config invalid. Run "nodecg defaultconfig" in this bundle?');
        return;
    }
    
    var streamtip_client = request.createClient('https://streamtip.com/api/');
    streamtip_client.headers['Authorization'] = nodecg.bundleConfig.streamtip_client_id + ' ' + nodecg.bundleConfig.streamtip_access_token;

    var dateFromTime = new Date();
    var dateToTime = null;

    function checkForNewTips()
    {
        dateToTime = new Date();
        streamtip_client.get('tips/?date_from=' + dateFromTime.toISOString() + '&date_to=' + dateToTime.toISOString(), function(err, res, body) {
            
            if (body.hasOwnProperty('status') && body.status == 200)
            {
                var count = body._count;
                if (count > 0) {
                    body.tips.forEach((tip, index, tips) => {

                        var tipObj = {username: tip.username, note: tip.note, amount: tip.amount};

                        if (tip.amount > RepsAndNames.ReplicantData.highestTip.amount.value) {
                            RepsAndNames.ReplicantData.highestTip.amount.value = tip.amount;
                            RepsAndNames.ReplicantData.highestTip.user.value = tip.username;
                            RepsAndNames.ReplicantData.highestTip.note.value = tip.note;
                            nodecg.sendMessage(RepsAndNames.MessageNames.tips.newHighestTip, tipObj);
                        }

                        RepsAndNames.ReplicantData.lastTip.amount.value = tip.amount;
                        RepsAndNames.ReplicantData.lastTip.user.value = tip.username;
                        RepsAndNames.ReplicantData.lastTip.note.value = tip.note;

                        RepsAndNames.ReplicantData.sessionTips.amount.value += tip.amount;
                        RepsAndNames.ReplicantData.sessionTips.tipSummary.value.unshift(tipObj);
                        nodecg.sendMessage(RepsAndNames.MessageNames.tips.newTip, tipObj);
                    });
                }
            }
            else
            {
                console.error("Streamtip Service error. \r\n" + body);
            }
        });
        dateFromTime = dateToTime;
    }

    setInterval(checkForNewTips, 3000);

};
