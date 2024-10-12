export abstract class UseCase<TInput extends object, TOutput> {
  abstract execute(input: TInput): Promise<TOutput>;
}
