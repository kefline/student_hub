class BaseController {
  constructor(model) {
    this.model = model;
  }

  // Create a new record
  async create(data) {
    try {
      const record = await this.model.create(data);
      return {
        success: true,
        data: record
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get a record by ID
  async getById(id) {
    try {
      const record = await this.model.findByPk(id);
      if (!record) {
        return {
          success: false,
          error: 'Record not found'
        };
      }
      return {
        success: true,
        data: record
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update a record
  async update(id, data) {
    try {
      const record = await this.model.findByPk(id);
      if (!record) {
        return {
          success: false,
          error: 'Record not found'
        };
      }
      await record.update(data);
      return {
        success: true,
        data: record
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete a record
  async delete(id) {
    try {
      const record = await this.model.findByPk(id);
      if (!record) {
        return {
          success: false,
          error: 'Record not found'
        };
      }
      await record.destroy();
      return {
        success: true,
        message: 'Record deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all records with pagination
  async getAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        where = {},
        order = [['createdAt', 'DESC']],
        include = []
      } = options;

      const offset = (page - 1) * limit;
      const records = await this.model.findAndCountAll({
        where,
        order,
        include,
        limit,
        offset
      });

      return {
        success: true,
        data: records.rows,
        pagination: {
          total: records.count,
          page: parseInt(page),
          pages: Math.ceil(records.count / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default BaseController; 