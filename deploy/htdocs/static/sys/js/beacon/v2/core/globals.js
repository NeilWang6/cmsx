/**
 * 公共变量管理
 * @author : yu.yuy, arcthur.cheny
 * @createTime : 2011-9-24
 * @modifyTime : 2013-07-03
 */

var isConflicted = true
  , doc = win.document
  , loc = doc.location
  , pro = loc.protocol;

var NOW = (new Date()).getTime();

if (win['Manifold'] === undefined) {
    Manifold = {};
    isConflicted = false;
} else {
    return;
}

var Globals = {
    opener : opener,
    pageId : null,
    customize : win['WolfSmoke'] || {},
    version : '2.1'
};
