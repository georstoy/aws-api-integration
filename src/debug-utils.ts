import { stringToCloudFormation } from "@aws-cdk/core";
import { listenerCount } from "cluster";

// only for debuging
const short = (text: string): string => {
    const charsShown = 37;

    if (text.length > 80) {
        return text.substr(0, charsShown) + " ... " + text.substr(text.length - charsShown, text.length);
    } else {
        return text;
    }
};

export {short};
