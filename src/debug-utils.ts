import { listenerCount } from "cluster"
import { stringToCloudFormation } from "@aws-cdk/core"

// only for debuging
const short = (text: string): string => {
    const charsShown = 37;

    if (text.length > 80) {
        return text.substr(1,charsShown) +' ... ' + text.substr(text.length-charsShown,text.length);
    } else {
        return text;
    }
}

export {short};