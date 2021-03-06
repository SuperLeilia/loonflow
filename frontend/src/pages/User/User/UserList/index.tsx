import React, { Component } from "react";
import {Table, Col, Card, Row, Form, Input, Button, message, Modal, Select, Radio, Popconfirm} from "antd";
import {addUser, delUserRequest, getDeptList, getUserList, resetUserPasswd, updateUser} from "@/services/user";
import UserRoleList from "@/pages/User/User/UserRoleList";

const { Option } = Select;


class UserList extends Component<any, any> {
  constructor(props) {
    super();
    this.state = {
      userResult: [],
      deptResult: [],
      userListLoading: false,
      userModalVisible: false,
      userRoleModalVisible: false,
      userDetail: {},
      userIdForRole: 0,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        onChange: (current) => {
          const pagination = { ...this.state.pagination };
          pagination.page = current;
          pagination.current = current;
          this.setState({ pagination }, () => {
            console.log('newpage');
            this.fetchUserData({
              page: pagination.page,
              per_page: pagination.pageSize
            })
          });
        }
      }
    }
  }


  componentDidMount() {
    this.fetchUserData({});
    this.fetchDeptData({});
  }

  fetchDeptData = async (params) => {
    // todo get dept data
    const result = await getDeptList(params);
    if (result.code ===0 ) {
      this.setState({deptResult: result.data.value})
    }
  }

  fetchUserData = async (params) => {
    this.setState({userListLoading: true});
    const result = await getUserList(params);
    if (result.code === 0) {
      const pagination = { ...this.state.pagination };
      pagination.page = result.data.page;
      pagination.pageSize = result.data.per_page;
      pagination.total = result.data.total;

      this.setState({
        userResult: result.data.value,
        userListLoading: false,
        pagination

      });

    } else {
      message.error(result.msg);
    }
  }

  searchTicket = (values) => {
    this.fetchUserData({per_page:10, page:1, search_value: values.search_value});
  }

  showUserModal =(userId) =>{
    this.setState({
      userModalVisible: true,
    })
  }

  onUserFinish= async (values) =>{
    values.dept_ids = values.dept.join(',');
    delete values['dept'];
    console.log(this.state.userDetail);
    console.log(this.state.userDetail.id)
    let result = {}
    if (this.state.userDetail && this.state.userDetail.id){
      result = await updateUser(this.state.userDetail.id, values);
    } else {
      result = await addUser(values);
    }
    if (result.code === 0) {
      message.success('????????????');
      this.setState({userModalVisible: false});
      this.fetchUserData({});
    } else {
      message.error(`????????????: ${result.msg}`);
    }
  }

  handleUserOk = () => {
    this.setState({
      userModalVisible: false,
      userRoleModalVisible: false
    })
  }

  handleUserCancel = () => {
    this.setState({
      userModalVisible: false,
      userRoleModalVisible: false
    })
  }

  resetPasswd = async (userId: number) => {
    const result = await resetUserPasswd(userId);
    if (result.code === 0 ) {
      message.success('????????????,?????????????????????123456');
    }
    else {
      message.error(`??????????????????: ${result.message}`);
    }

  }

  delUser = async(userId:number) => {
    const result = await delUserRequest(userId);
    if (result.code === 0 ) {
      // ??????????????????
      this.fetchUserData({});
      message.success('????????????');
    }
    else {
      message.error(`????????????: ${result.message}`);
    }
  }


  showEditModal = (record: any) =>{
    record.is_active = record.is_active? 1: 0;
    const deptInfo: Arrary = [];
    if (record.user_dept_info_list.length===0){
      record.dept = []
    } else {
      record.user_dept_info_list.forEach(result =>{
        deptInfo.push(result.id);
      })
      record.dept = deptInfo;
    }
    console.log(record);

    this.setState({userDetail:record, userModalVisible:true})
  }

  getUserDetailField = (fieldName:string) =>{
    if(this.state && this.state.userDetail){
      return this.state.userDetail[fieldName]
    }
    return ''
  }

  showUserRole = (userId: number) => {
    this.setState({userIdForRole: userId, userRoleModalVisible:true});
  }

  render() {

    const columns = [
      {
        title: "?????????",
        dataIndex: "username",
        key: "username"
      },
      {
        title: "??????",
        dataIndex: "alias",
        key: "alias"
      },
      {
        title: "??????",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "??????",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "??????",
        key: "user_dept",
        render: (text: string, record: any) => {
          const deptInfoList = [];
          record.user_dept_info_list.forEach(function(item) {
            deptInfoList.push(item.name);
          });
          return deptInfoList.join(',');

        }
      },
      {
        title: "??????",
        dataIndex: "is_active",
        key: "is_active",
        render: (text: string, record:any) => {
          if (record.is_active) {
            return '??????'
          } else {
            return '?????????'
          }
        }
      },
      {
        title: "????????????",
        key: "userType",
        render: (text: string, record: any) => {
          if (record.type_id === 0) {
            return "????????????"
          } else if (record.type_id === 1) {
            return "??????????????????"
          } else if (record.type_id === 2) {
            return "???????????????"
          } else {
            return "??????"
          }
        }
      },
      {
        title: "?????????",
        dataIndex: ["creator_info", "creator_alias"],
        key: "creator_info"
      },
      {
        title: "????????????",
        dataIndex: "gmt_created",
        key: "gmt_created"
      },
      {
        title: "??????",
        key: "action",
        render: (text: string, record: any) => (
          <span>
            <a style={{marginRight: 16}} onClick={() => this.showEditModal(record)}>??????</a>
            <a style={{marginRight: 16}}>
              <Popconfirm
                title="????????????????????????????????????????????????123456"
                onConfirm={()=>this.resetPasswd(record.id)}>
                <a href="#">????????????</a>
              </Popconfirm>
            </a>
            <a style={{marginRight: 16}} onClick={()=>this.showUserRole(record.id)}>????????????</a>
            <a style={{marginRight: 16, color: "red"}}>
              <Popconfirm
                title="???????????????"
                onConfirm={()=>{this.delUser(record.id)}}
              >
                ??????
              </Popconfirm>
            </a>
          </span>
        )
      }

    ]

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    return (
      <div>
        <Card>
        <Form
          name="advanced_search"
          className="ant-advanced-search-form"
          onFinish={this.searchTicket}
        >
          <Row gutter={24}>
            <Col span={6} key={"search_value"}>
              <Form.Item
                name={"search_value"}
                label={"??????"}
              >
                <Input placeholder="????????????????????????????????????" />
              </Form.Item>
            </Col>
            <Col>
            <Button type="primary" htmlType="submit">
              ??????
            </Button>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={()=>this.showUserModal(0)}>
                ??????
              </Button>
              </Col>
          </Row>
        </Form>
          <Table loading={this.state.userListLoading} columns={columns} dataSource={this.state.userResult}
                 rowKey={record => record.id} pagination={this.state.pagination}/>
        </Card>
        <Modal
          title="??????"
          visible={this.state.userModalVisible}
          onOk={this.handleUserOk}
          onCancel={this.handleUserCancel}
          width={800}
          footer={null}
          destroyOnClose
        >
          <Form
            {...layout}
            onFinish={this.onUserFinish}
          >
            <Form.Item name="username" label="?????????" rules={[{ required: true }]} initialValue={this.getUserDetailField('username')}>
              <Input />
            </Form.Item>
            <Form.Item name="alias" label="??????" rules={[{ required: true }]} initialValue={this.getUserDetailField('alias')}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="??????" rules={[{ required: true }]} initialValue={this.getUserDetailField('email')}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="??????" rules={[{ required: true }]} initialValue={this.getUserDetailField('phone')}>
              <Input />
            </Form.Item>
            <Form.Item name="dept" label="??????" rules={[{ required: true }]}  initialValue={this.getUserDetailField('dept')}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="???????????????????????????"
              >
                {this.state.deptResult.map(d => (

                  <Option key={d.id} value={d.id}>{d.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="is_active" label="??????" initialValue={this.getUserDetailField('is_active')}>
              <Radio.Group value = {this.state.defaultUserState}>
                <Radio value={1}>??????</Radio>
                <Radio value={0}>??????</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="type_id" label="????????????" initialValue={this.getUserDetailField('type_id')}>
              <Radio.Group >
                <Radio value={0}>????????????</Radio>
                <Radio value={1}>??????????????????</Radio>
                <Radio value={2}>???????????????</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                ??????
              </Button>
            </Form.Item>

          </Form>
        </Modal>

        <Modal
          title={"????????????"}
          visible={ this.state.userRoleModalVisible}
          width={800}
          footer={null}
          onOk={this.handleUserOk}
          onCancel={this.handleUserCancel}
          destroyOnClose
        >
          <UserRoleList userId={this.state.userIdForRole}/>

        </Modal>
      </div>

    )

  }

}

export default UserList;
