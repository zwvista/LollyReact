import * as React from 'react';
import { Inject } from 'react.di';
import { SettingsService } from '../view-models/settings.service';

export default class Settings extends React.Component<any, any> {
  @Inject settingsService: SettingsService;

  render() {
    return (
      <p> Settings </p>
    );
  }
};
