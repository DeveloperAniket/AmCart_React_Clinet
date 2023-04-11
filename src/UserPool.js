import { CognitoUserPool } from 'amazon-cognito-identity-js';
const poolData = {
  UserPoolId: 'us-east-1_t9oJqRHeF',
  ClientId: 'vseevp72rv0q04j3q5ccq05s',
};
export default new CognitoUserPool(poolData);