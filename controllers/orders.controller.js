const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const Order = db.order;
const response = require("../helpers/response.helper");

exports.CreateOrder = async (req, res) => {
  let user_id = req.body.user_id;
  let sub_total = req.body.sub_total;
  let phone = req.body.phone;
  // console.log(req.body);
  try {
    let order = await Order.create({
      user_id: user_id,
      sub_total: sub_total,
      phone: phone,
    });
    if (!order) {
      return response.responseHelper(
        res,
        false,
        "Something went wrong.\nPlease try again.",
        "Unexpected Failure"
      );
    }
    return response.responseHelper(
      res,
      true,
      {
        order: order,
      },
      "Successfully added order"
    );
  } catch (error) {
    console.log(error);
    return response.responseHelper(
      res,
      false,
      "Something went wrong.\nPlease try again.",
      "Unexpected Failure"
    );
  }
};

exports.GetOrders = async (req, res) => {
  let user_id = req.body.user_id;
  // console.log(req.body);
  try {
    let orders = await Order.findAndCountAll({
      where: {
        user_id: user_id,
      },
    });
    return response.responseHelper(
      res,
      true,
      {
        count: orders.count,
        orders: orders.rows,
      },
      "Successfully fetched orders"
    );
  } catch (error) {
    console.log(error);
    return response.responseHelper(
      res,
      false,
      "Something went wrong.",
      "Unexpected Failure"
    );
  }
};
