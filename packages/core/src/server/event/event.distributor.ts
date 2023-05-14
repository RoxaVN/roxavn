import { Subject } from 'rxjs';

export class topicData {
  private data: Record<string, Record<string, Subject<any>>> = {};

  on(eventName: string, handler: (arg: any) => void, topic = '') {
    let topicData = this.data[topic];
    if (!topicData) {
      topicData = {};
      this.data[topic] = topicData;
    }
    let subject = topicData[eventName];
    if (!subject) {
      subject = new Subject<any>();
      topicData[eventName] = subject;
    }
    return subject.subscribe(handler);
  }

  trigger(eventName: string, data: any, topic = '') {
    const subject = this.data[topic]?.[eventName];
    if (subject) {
      subject.next(data);
    }
  }
}
