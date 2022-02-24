describe("Vérification des variables .env", () => {
    const ENV_URL = process.env.REACT_APP_API_URL;

    test("Vérification du type de l'url", () => {
        expect(typeof ENV_URL).toBe('string');
    });

    test("Vérification de la valeur de l'url", () => {
        expect(ENV_URL).toEqual('https://localhost:44313/api/');
    });
});
