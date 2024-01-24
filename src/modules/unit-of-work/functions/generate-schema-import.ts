import {
  AsyncModelFactory,
  ModelDefinition,
  getConnectionToken,
} from '@nestjs/mongoose';
import { Connection, Schema } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { AutoIncrementOptions } from '../interfaces/auto-increment-options';

export function generateSchemaImport(
  className: string,
  schema: Schema,
  autoIncrement?: AutoIncrementOptions,
): AsyncModelFactory {
  const schemaObject: ModelDefinition['schema'] = {
    name: className,
    useFactory: (connection: Connection) => {
      if (autoIncrement) {
        const autoIncrementPlugin = AutoIncrementFactory(connection);
        schema.plugin(autoIncrementPlugin, autoIncrement);

        return schema;
      } else return schema;
    },
    inject: [getConnectionToken()],
  };

  return schemaObject;
}
