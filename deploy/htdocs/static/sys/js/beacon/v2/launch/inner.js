/**
 * Æô¶¯
 * @author : arcthur.cheny
 * @createTime : 2013-08-05
 * @modifyTime : 2013-08-05
 */

if (!Tools.sampling()) {
    return;
}

try {
    Essential.send();
} catch(e) {
    Recorder.sendError(e, 'essential');
}