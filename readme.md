后端项目说明：

基于MybatisPlus、SpringBoot框架，实现了拼车单、用户信息的CRUD，借助分页插件实现了分页查询。



基于session会话技术实现了用户的登录和登录校验，基于Spring拦截器实现对访问的统一拦截。

借助MybatisPlus的insertFill和updateFill实现了数据的自动插入**标准化**，基于**标准化**的方式实现了一定程度上对模糊匹配的优化，在MySQl上实现了基本的**搜索**功能。

基于Elasticsearch的IK分词器，实现了进一步的搜索功能，包括**聚合搜索**和**模糊匹配**

使用Kafka中间件，保证Elasticsearch和MySQL数据库的**最终一致性**

