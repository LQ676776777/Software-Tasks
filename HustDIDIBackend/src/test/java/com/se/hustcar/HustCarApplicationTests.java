package com.se.hustcar;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.User;
import com.se.hustcar.mapper.CarpoolMapper;
import com.se.hustcar.mapper.UserMapper;
import com.se.hustcar.service.CarpoolService;
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.client.indices.GetIndexResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
class HustCarApplicationTests {
    @Autowired
    private CarpoolMapper carpoolMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private CarpoolService carpoolService;

    /**
     * 测试es的连接
     */
    @Test
    public void test9() throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http")
        ));
        GetIndexRequest carpool = new GetIndexRequest("carpool");
        GetIndexResponse response = client.indices().get(carpool, RequestOptions.DEFAULT);
        System.out.println(response.getAliases());
        System.out.println(response.getMappings());
        System.out.println(response.getSettings());
        client.close();
    }
    @Test
    public void test10() throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http")
        ));
        SearchRequest request = new SearchRequest();
        request.indices("carpool");
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        boolQueryBuilder.must(QueryBuilders.matchQuery("start_place","华科"));
        boolQueryBuilder.must(QueryBuilders.rangeQuery("date_time").gt(LocalDateTime.now()));
        sourceBuilder.query(boolQueryBuilder);
        request.source(sourceBuilder);
        SearchResponse response = client.search(request, RequestOptions.DEFAULT);

        System.out.println(response.getHits().getHits());
        System.out.println(response.getHits().getTotalHits());
        SearchHits hits = response.getHits();
        for (SearchHit searchHit : hits){
            System.out.println(searchHit.getSourceAsString());
        }
        client.close();
    }
    @Test
    void contextLoads() {
    }
    @Test
    public void test1(){
        List<CarPool> list = carpoolMapper.selectList(null);
        System.out.println(list);
    }
    @Test
    public void test2(){
        List<User> list = userMapper.selectList(null);
        System.out.println(list);
    }
    @Test
    public void test3(){
        User user = userMapper.selectById(1L);
        System.out.println(user);
    }
    @Test
    public void test4(){
        //依据手机号查询用户
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getPhoneNumber, "12345678911"));
        System.out.println(user);
    }
    @Test
    public void test5(){
        //新增用户
        User user = new User();
        user.setPhoneNumber("13849098687");
        userMapper.insert(user);
    }
    //分页查询
    @Test
    public void test6(){
        int pageNo = 2;
        int pageSize = 2;
        Page<CarPool> page = Page.of(pageNo, pageSize);
        carpoolService.page(page);
        System.out.println(page.getRecords());
    }
    //将数据库中的startplace和destination全部标准化进行更新
    @Test
    public void test7(){
        List<CarPool> carPools = carpoolMapper.selectList(null);
        for (CarPool carPool : carPools) {
            String normalizedStart = com.se.hustcar.utils.PlaceNormalizer.normalize(carPool.getStartPlace());
            String normalizedEnd = com.se.hustcar.utils.PlaceNormalizer.normalize(carPool.getDestination());
            carPool.setNormalizedStartPlace(normalizedStart);
            carPool.setNormalizedDestination(normalizedEnd);
            carpoolMapper.updateById(carPool);
        }
    }
    //插入一条测试数据，看看标准化是否生效
    @Test
    public void test8(){
        CarPool carPool = new CarPool();
        carPool.setUserId(1L);
        carPool.setStartPlace("华中科技大学东校区火车站");
        carPool.setDestination("武汉大学南门");
        //设置时间,localfatetime
        carPool.setDateTime(LocalDateTime.now());
        carPool.setState(1);
        carpoolMapper.insert(carPool);
    }
}
