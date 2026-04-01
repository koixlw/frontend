<template>
  <div class="users-management">
    <DataTable
      title="用户管理"
      :columns="columns"
      :data="users"
      :loading="loading"
      :pagination="pagination"
      :showAddButton="true"
      @add="showAddDialog"
      @edit="showEditDialog"
      @delete="handleDelete"
      @refresh="loadUsers"
      @page-change="handlePageChange"
    />

    <!-- 新增/编辑表单 -->
    <DataForm
      v-if="formVisible"
      :title="formTitle"
      :fields="formFields"
      :initialData="currentItem"
      :loading="formLoading"
      @close="closeForm"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import DataTable from '../../components/admin/DataTable.vue';
import DataForm from '../../components/admin/DataForm.vue';
import { getUsers, createUser, updateUser, deleteUser } from '@/api/modules';

export default {
  name: 'UsersManagement',
  components: {
    DataTable,
    DataForm
  },
  setup() {
    const users = ref([]);
    const loading = ref(false);
    const pagination = ref(null);
    const currentPage = ref(0);
    
    const formVisible = ref(false);
    const formTitle = ref('');
    const formLoading = ref(false);
    const currentItem = ref(null);
    const isEditing = ref(false);

    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'username', label: '用户名' },
      { key: 'email', label: '邮箱' },
      { key: 'phone', label: '手机号' },
      { key: 'role', label: '角色', type: 'status' },
      { key: 'status', label: '状态', type: 'status' },
      { key: 'createdAt', label: '创建时间', type: 'date' },
    ];

    const formFields = [
      {
        key: 'username',
        label: '用户名',
        type: 'text',
        required: true,
        placeholder: '请输入用户名'
      },
      {
        key: 'email',
        label: '邮箱',
        type: 'email',
        required: true,
        placeholder: '请输入邮箱'
      },
      {
        key: 'phone',
        label: '手机号',
        type: 'text',
        required: true,
        placeholder: '请输入手机号'
      },
      {
        key: 'password',
        label: '密码',
        type: 'text',
        required: true,
        placeholder: '请输入密码'
      },
      {
        key: 'role',
        label: '角色',
        type: 'select',
        required: true,
        options: [
          { value: 'USER', label: '普通用户' },
          { value: 'ADMIN', label: '管理员' }
        ]
      },
      {
        key: 'status',
        label: '状态',
        type: 'select',
        required: true,
        options: [
          { value: 'ACTIVE', label: '激活' },
          { value: 'INACTIVE', label: '未激活' },
          { value: 'BANNED', label: '禁用' }
        ]
      }
    ];

    const loadUsers = async () => {
      try {
        loading.value = true;
        const response = await getUsers(currentPage.value, 10);
        users.value = response.content || [];
        pagination.value = {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          first: response.first,
          last: response.last
        };
      } catch (error) {
        console.error('加载用户列表失败:', error);
        alert('加载用户列表失败');
      } finally {
        loading.value = false;
      }
    };

    const showAddDialog = () => {
      isEditing.value = false;
      formTitle.value = '新增用户';
      currentItem.value = null;
      formVisible.value = true;
    };

    const showEditDialog = (item) => {
      isEditing.value = true;
      formTitle.value = '编辑用户';
      currentItem.value = { ...item };
      formVisible.value = true;
    };

    const closeForm = () => {
      formVisible.value = false;
      currentItem.value = null;
    };

    const handleSubmit = async (data) => {
      try {
        formLoading.value = true;
        if (isEditing.value) {
          await updateUser(currentItem.value.id, data);
          alert('更新成功');
        } else {
          await createUser(data);
          alert('创建成功');
        }
        closeForm();
        loadUsers();
      } catch (error) {
        console.error('提交失败:', error);
        alert('提交失败');
      } finally {
        formLoading.value = false;
      }
    };

    const handleDelete = async (item) => {
      if (!confirm(`确定要删除用户 ${item.username} 吗？`)) {
        return;
      }
      try {
        await deleteUser(item.id);
        alert('删除成功');
        loadUsers();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
      }
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      loadUsers();
    };

    onMounted(() => {
      loadUsers();
    });

    return {
      users,
      loading,
      pagination,
      columns,
      formVisible,
      formTitle,
      formFields,
      formLoading,
      currentItem,
      loadUsers,
      showAddDialog,
      showEditDialog,
      closeForm,
      handleSubmit,
      handleDelete,
      handlePageChange
    };
  }
};
</script>

<style scoped>
.users-management {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

