export class ExactProps<T> {
  constructor(props: T) {
    Object.assign(this, props);
  }
}

export class PartialProps<T> {
  constructor(props?: Partial<T>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
