import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import { Page } from 'components'
import List from './components/List'

const { TabPane } = Tabs

const EnumPostStatus = {
  UNPUBLISH: 1,
  PUBLISHED: 2,
}

const Index = (props) => {
  const { post, dispatch, loading, location } = props;
  const { list, pagination } = post;
  const { query, pathname } = location
  // Index 是functional component
  // data source: this.props
  // { location: {query, pathname, ...}}
  // 页面刚加载时只有pathname， query来源

  // listProps是List的数据源
  // type: Object
  // data source: this.props(pagination, list)
  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['post/query'],
    onChange (page) {
      dispatch(routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        }),
      }))
    },
  }

  const handleTabClick = (key) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        status: key,
      }),
    }))
  }


  return (<Page inner>
    <Tabs activeKey={query.status === String(EnumPostStatus.UNPUBLISH) ? String(EnumPostStatus.UNPUBLISH) : String(EnumPostStatus.PUBLISHED)} onTabClick={handleTabClick}>
      <TabPane tab="Publised" key={String(EnumPostStatus.PUBLISHED)}>
        <List {...listProps} />
      </TabPane>
      <TabPane tab="Unpublish" key={String(EnumPostStatus.UNPUBLISH)}>
        <List {...listProps} />
      </TabPane>
    </Tabs>
  </Page>)
}

Index.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ post, loading }) => ({ post, loading }))(Index)
