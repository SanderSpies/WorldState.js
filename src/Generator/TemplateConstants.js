var fs = require('fs');


/**
 * Here the templates are kept for easy access
 *
 * @lends {TemplateConstants}
 * @const
 */
var TemplateConstants = {
  ENABLE_VERSIONING_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/enableVersioning.jst', { encoding:'utf8'}),
  SAVE_VERSION_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/saveVersion.jst', { encoding:'utf8'}),
  RESTORE_VERSION_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/restoreVersion.jst', { encoding:'utf8'}),
  GET_VERSIONS_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/getVersions.jst', { encoding:'utf8'}),
  CHANGE_REFERENCE_TO_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/changeReferenceTo.jst', { encoding:'utf8'}),
  CHANGE_VALUE_TO_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/changeValueTo.jst', { encoding:'utf8'}),
  READ_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/read.jst', { encoding:'utf8'}),
  WHERE_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/where.jst', { encoding:'utf8'}),
  AT_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/at.jst', { encoding:'utf8'}),
  INSERT_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/insert.jst', { encoding:'utf8'}),
  INSERT_MULTI_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/insertMulti.jst', { encoding:'utf8'}),
  __SUB_GRAPH_WRAPPER__: fs.readFileSync(__dirname + '/Templates/Functions/__subGraphWrapper__.jst', { encoding:'utf8'}),
  __SUB_GRAPH_REQUIRE__: fs.readFileSync(__dirname + '/Templates/Functions/__subGraphRequire__.jst', { encoding:'utf8'}),
  IMMUTABLE_GRAPH_OBJECT_TEMPLATE: fs.readFileSync(__dirname + '/Templates/ImmutableObjectTemplate.jst', { encoding:'utf8'}),
  IMMUTABLE_GRAPH_ARRAY_TEMPLATE: fs.readFileSync(__dirname + '/Templates/ImmutableArrayTemplate.jst', { encoding:'utf8'}),
  AFTER_CHANGE_FUNCTION: fs.readFileSync(__dirname + '/Templates/Functions/afterChange.jst', { encoding:'utf8'})
};

module.exports = TemplateConstants;
