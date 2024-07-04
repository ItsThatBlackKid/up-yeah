import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    
    {
        "extends": [ "tslint:recommended", "tslint-config-prettier" ],
        "rules": {
            "await-promise": true,
            "no-duplicate-imports": true,
            "ordered-imports": true
        }
    }
);