﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
using System.Data.Common;
using System.Reflection;
using System.Data;
using BeautyPoly.Common;
using Microsoft.Data.SqlClient;

namespace BeautyPoly.Common
{
	public static class SQLHelper<T> where T : class, new()
    {
        static string connectionString = Config.Connection();
        public static T ProcedureToModel(string procedureName, string[] paramName, object[] paramValue)
        {
            T model = new T();
            SqlConnection mySqlConnection = new SqlConnection(connectionString);
            SqlParameter sqlParam;
            mySqlConnection.Open();

            try
            {
                SqlCommand mySqlCommand = new SqlCommand(procedureName, mySqlConnection);
                mySqlCommand.CommandType = CommandType.StoredProcedure;
                if (paramName != null)
                {
                    for (int i = 0; i < paramName.Length; i++)
                    {
                        sqlParam = new SqlParameter(paramName[i], paramValue[i]);
                        mySqlCommand.Parameters.Add(sqlParam);
                    }
                }
                SqlDataReader reader = mySqlCommand.ExecuteReader();
                model = reader.MapToSingle<T>();
            }
            catch (SqlException e)
            {
                throw new Exception(e.ToString());
            }
            finally
            {
                mySqlConnection.Close();
            }

            return model;
        }
        public static List<T> ProcedureToList( string procedureName, string[] paramName, object[] paramValue)
        {
            List<T> lst = new List<T>();
            SqlConnection mySqlConnection = new SqlConnection(connectionString);
            SqlParameter sqlParam;
            mySqlConnection.Open();

            try
            {
                SqlCommand mySqlCommand = new SqlCommand(procedureName, mySqlConnection);
                mySqlCommand.CommandType = CommandType.StoredProcedure;
                if (paramName != null)
                {
                    for (int i = 0; i < paramName.Length; i++)
                    {
                        sqlParam = new SqlParameter(paramName[i], paramValue[i]);
                        mySqlCommand.Parameters.Add(sqlParam);
                    }
                }
                SqlDataReader reader = mySqlCommand.ExecuteReader();
                lst = reader.MapToList<T>();
            }
            catch (SqlException e)
            {
                throw new Exception(e.ToString());
            }
            finally
            {
                mySqlConnection.Close();
            }

            return lst;
        }
        public static T SqlToModel(string sql)
        {
            T model = new T();
            SqlConnection mySqlConnection = new SqlConnection(connectionString);
            mySqlConnection.Open();
            try
            {
                SqlCommand mySqlCommand = new SqlCommand(sql, mySqlConnection);
                mySqlCommand.CommandType = CommandType.Text;
                SqlDataReader reader = mySqlCommand.ExecuteReader();
                model = reader.MapToSingle<T>();
            }
            catch (SqlException e)
            {
                throw new Exception(e.ToString());
            }
            finally
            {
                mySqlConnection.Close();
            }

            return model;
        }
        public static List<T> SqlToList(string sql)
        {
            List<T> lst = new List<T>();
            SqlConnection mySqlConnection = new SqlConnection(connectionString);
            mySqlConnection.Open();
            try
            {
                SqlCommand mySqlCommand = new SqlCommand(sql, mySqlConnection);
                mySqlCommand.CommandType = CommandType.Text;
                SqlDataReader reader = mySqlCommand.ExecuteReader();
                lst = reader.MapToList<T>();
            }
            catch (SqlException e)
            {
                throw new Exception(e.ToString());
            }
            finally
            {
                mySqlConnection.Close();
            }

            return lst;
        }
    }
}
