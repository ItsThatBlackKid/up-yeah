
export const runExample = async (name: string, exampleFn:  () => Promise<void>) => {
    console.log(`*** START EXAMPLE: ${name} ***`);

    await exampleFn()

    console.log(`*** END EXAMPLE: ${name} ***`);
}