<template>
  <div class="inheritors-management">
    <DataTable
      title="传承人管理"
      :columns="columns"
      :data="inheritors"
      :loading="loading"
      :pagination="pagination"
      @add="showAddDialog"
      @edit="showEditDialog"
      @delete="handleDelete"
      @refresh="loadInheritors"
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
import { getInheritors, createInheritor, updateInheritor, deleteInheritor } from '@/api/modules';

export default {
  name: 'InheritorsManagement',
  components: {
    DataTable,
    DataForm
  },
  setup() {
    const inheritors = ref([]);
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
      { key: 'name', label: '姓名' },
      { key: 'title', label: '称号' },
      { key: 'level', label: '级别' },
      { key: 'region', label: '地区' },
      { key: 'year', label: '入选年份' },
      { key: 'craftType', label: '技艺类型' },
      { key: 'isActive', label: '状态', format: (val) => val ? '启用' : '禁用' },
    ];

    const formFields = [
      {
        key: 'name',
        label: '姓名',
        type: 'text',
        required: true,
        placeholder: '请输入传承人姓名'
      },
      {
        key: 'title',
        label: '称号',
        type: 'text',
        required: true,
        placeholder: '请输入传承人称号'
      },
      {
        key: 'description',
        label: '简介',
        type: 'textarea',
        placeholder: '请输入传承人简介'
      },
      {
        key: 'imageUrl',
        label: '传承人照片',
        type: 'image',
        help: '点击上传传承人照片'
      },
      {
        key: 'level',
        label: '级别',
        type: 'select',
        required: true,
        options: [
          { value: 'NATIONAL', label: '国家级' },
          { value: 'PROVINCIAL', label: '省级' },
          { value: 'MUNICIPAL', label: '市级' },
          { value: 'COUNTY', label: '县级' }
        ]
      },
      {
        key: 'region',
        label: '地区',
        type: 'select',
        required: true,
        options: [
          // 直辖市
          { value: 'BEIJING', label: '北京市' },
          { value: 'SHANGHAI', label: '上海市' },
          { value: 'TIANJIN', label: '天津市' },
          { value: 'CHONGQING', label: '重庆市' },
          
          // 华北地区
          { value: 'HEBEI', label: '河北省' },
          { value: 'SHANXI', label: '山西省' },
          { value: 'NEIMENGGU', label: '内蒙古自治区' },
          
          // 东北地区
          { value: 'LIAONING', label: '辽宁省' },
          { value: 'JILIN', label: '吉林省' },
          { value: 'HEILONGJIANG', label: '黑龙江省' },
          
          // 华东地区
          { value: 'JIANGSU', label: '江苏省' },
          { value: 'ZHEJIANG', label: '浙江省' },
          { value: 'ANHUI', label: '安徽省' },
          { value: 'FUJIAN', label: '福建省' },
          { value: 'JIANGXI', label: '江西省' },
          { value: 'SHANDONG', label: '山东省' },
          
          // 华中地区
          { value: 'HENAN', label: '河南省' },
          { value: 'HUBEI', label: '湖北省' },
          { value: 'HUNAN', label: '湖南省' },
          
          // 华南地区
          { value: 'GUANGDONG', label: '广东省' },
          { value: 'GUANGXI', label: '广西壮族自治区' },
          { value: 'HAINAN', label: '海南省' },
          
          // 西南地区
          { value: 'SICHUAN', label: '四川省' },
          { value: 'GUIZHOU', label: '贵州省' },
          { value: 'YUNNAN', label: '云南省' },
          { value: 'XIZANG', label: '西藏自治区' },
          
          // 西北地区
          { value: 'SHAANXI', label: '陕西省' },
          { value: 'GANSU', label: '甘肃省' },
          { value: 'QINGHAI', label: '青海省' },
          { value: 'NINGXIA', label: '宁夏回族自治区' },
          { value: 'XINJIANG', label: '新疆维吾尔自治区' },
          
          // 特别行政区
          { value: 'HONGKONG', label: '香港特别行政区' },
          { value: 'MACAO', label: '澳门特别行政区' },
          { value: 'TAIWAN', label: '台湾省' }
        ]
      },
      {
        key: 'year',
        label: '入选年份',
        type: 'number',
        required: true,
        min: 1900,
        max: 2100
      },
      {
        key: 'craftType',
        label: '技艺类型',
        type: 'text',
        placeholder: '如：泥塑、剪纸等'
      },
      {
        key: 'achievements',
        label: '主要成就',
        type: 'textarea',
        placeholder: '请输入主要成就'
      },
      {
        key: 'sortOrder',
        label: '排序',
        type: 'number',
        default: 0
      },
      {
        key: 'isActive',
        label: '是否启用',
        type: 'switch',
        default: true
      }
    ];

    const loadInheritors = async () => {
      try {
        loading.value = true;
        const response = await getInheritors(currentPage.value, 10);
        inheritors.value = response.content || [];
        pagination.value = {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          first: response.first,
          last: response.last
        };
      } catch (error) {
        console.error('加载传承人列表失败:', error);
        alert('加载传承人列表失败');
      } finally {
        loading.value = false;
      }
    };

    const showAddDialog = () => {
      isEditing.value = false;
      formTitle.value = '新增传承人';
      currentItem.value = null;
      formVisible.value = true;
    };

    const showEditDialog = (item) => {
      isEditing.value = true;
      formTitle.value = '编辑传承人';
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
          await updateInheritor(currentItem.value.id, data);
          alert('更新成功');
        } else {
          await createInheritor(data);
          alert('创建成功');
        }
        closeForm();
        loadInheritors();
      } catch (error) {
        console.error('提交失败:', error);
        alert('提交失败');
      } finally {
        formLoading.value = false;
      }
    };

    const handleDelete = async (item) => {
      if (!confirm(`确定要删除传承人 ${item.name} 吗？`)) {
        return;
      }
      try {
        await deleteInheritor(item.id);
        alert('删除成功');
        loadInheritors();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
      }
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      loadInheritors();
    };

    onMounted(() => {
      loadInheritors();
    });

    return {
      inheritors,
      loading,
      pagination,
      columns,
      formVisible,
      formTitle,
      formFields,
      formLoading,
      currentItem,
      loadInheritors,
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
.inheritors-management {
  max-width: 1400px;
  margin: 0 auto;
}
</style>

