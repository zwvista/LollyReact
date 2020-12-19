export class MUserSettings {
  records!: MUserSetting[];
}
export class MUserSetting {
  ID!: number;
  USERID!: number;
  KIND!: number;
  ENTITYID!: number;
  VALUE1!: string;
  VALUE2!: string;
  VALUE3!: string;
  VALUE4!: string;
}
export class MUserSettingInfo {
  USERSETTINGID = 0;
  VALUEID = 0;
}
