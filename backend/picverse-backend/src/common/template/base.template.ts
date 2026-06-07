export abstract class BaseTemplate<I, O> {
  // Template method
  async run(input: I): Promise<O> {
    await this.validate(input);
    const prepared = await this.preprocess(input);
    const coreResult = await this.executeCore(prepared);
    return this.postprocess(coreResult);
  }

  protected async validate(_input: I): Promise<void> { /* optional */ }
  protected async preprocess(input: I): Promise<any> { return input; }
  protected abstract executeCore(prepared: any): Promise<any>;
  protected async postprocess(result: any): Promise<O> { return result as O; }
}