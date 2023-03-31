// 定义分页查询函数
async function paginate(model, query, options) {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;
  const sort = options.sort || {};

  const countQuery = model.countDocuments(query);
  const documentsQuery = model.find(query).skip(skip).limit(limit).sort(sort);
  try {
    const [total, data] = await Promise.all([
      countQuery.exec(),
      documentsQuery.lean().exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return {
      data,
      total,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPreviousPage
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error paginating data");
  }
}

export default paginate;
