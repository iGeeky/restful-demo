<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.key"
        placeholder="Name Or Description"
        style="width: 240px;"
        class="filter-item"
        maxlength="48"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" type="primary" @click="handleAdd">New</el-button>
    </div>

    <el-table :data="datas" style="margin-top:30px; " border>
      <el-table-column align="center" label="ID" min-width="15" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name" min-width="20" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Description" min-width="40" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Create Time" min-width="20" show-overflow-tooltip prop="create_time" :formatter="unixtimeFormat" />
      <el-table-column align="center" label="Operations" min-width="20">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination pagination-center">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="listData" />
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?`Edit ${this.model}`:`New ${this.model}`" custom-class="rbac-edit-dialog">
      <el-form ref="form" :model="data" :rules="rules" label-width="100px" label-position="left">
        <el-form-item v-if="dialogType == 'edit'" :label="`${model} ID`" prop="id">
          <el-input
            v-model="data.id"
            :placeholder="`${model} id`"
            :readonly="true"
            minlength="3"
            maxlength="32"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input
            v-model="data.name"
            :placeholder="`${model} name`"
            minlength="5"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="data.description"
            placeholder="Description"
            maxlength="256"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="validateAndSubmit('form');">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { list, add, deleteById, update, checkNameExist } from '@/api/common'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const defaultValue = {
  id: '',
  name: '',
  description: '',
}

export default {
  name: 'Demo',
  components: { Pagination },
  props: {
    model: {
      type: String,
      default: 'application',
    },
  },
  data() {
    return {
      data: Object.assign({}, defaultValue),
      datas: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        key: undefined,
      },
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title',
      },
      rules: {
        name: [
          { required: true, message: `Please input ${this.model} name`, trigger: ['blur', 'change'] },
          { validator: this.validateName, trigger: ['blur', 'change'] },
        ],
      },
    }
  },
  created() {
    this.listData()
  },
  mounted() {},
  methods: {
    async listData() {
      const res = await list(this.model, this.listQuery)
      if (res.ok) {
        this.total = res.data.total
        this.datas = res.data.datas
      }
    },

    async validateName(rule, value, callback) {
      const res = await checkNameExist(this.model, value, this.data.id)
      if (res.ok && res.exist) {
        callback(new Error(`${this.model} name '${value}' already exists`))
      } else {
        callback()
      }
    },

    handleFilter() {
      this.listQuery.page = 1
      this.listData()
    },

    handleAdd() {
      this.data = Object.assign({}, defaultValue)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.data = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm(`Confirm to remove the ${this.model}?`, 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(async() => {
          const res = await deleteById(this.model, row.id)
          if (res.ok) {
            this.listData()
            this.$message({
              type: 'success',
              message: 'Delete succed!',
            })
          }
        })
        .catch(err => { console.error(err) })
    },

    async validateAndSubmit(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          await this.submit()
        } else {
          return false
        }
      })
    },

    async submit() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        const res = await update(this.model, this.data.id, this.data)
        if (!res.ok) {
          return
        }
        this.listData()
        const { name } = this.data
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `
            <div>Alter ${this.model} '${name}' success.</div>
          `,
          type: 'success',
        })
      } else {
        const res = await add(this.model, this.data)
        if (!res.ok) {
          return
        }
        this.listData()

        const { name } = this.data
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `<div>${this.model} '${name}' added.</div>`,
          type: 'success',
        })
      }
    },
  },
}
</script>
