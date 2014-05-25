Common
全站公用但又不属于fdev框架的东西

abtest-beacon: 加入AS辅助统计功能的beacon打点方法，主要用于ABTest
    传送的数据包括：
	ABTest的id
	AS生成的不重复客户端id, 
	数据仓库提供的 ali_beacon_id (在cookie中)
	用户播放器版本
