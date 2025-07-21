import React from 'react'
import { styled } from '@emotion/styled'
import { Box, Paper, Grid } from '@mui/material'
const MainLayout = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={8}>
            <Item>size=8</Item>
          </Grid>
          <Grid size={4}>
            <Item>size=4</Item>
          </Grid>
          <Grid size={4}>
            <Item>size=4</Item>
          </Grid>
          <Grid size={8}>
            <Item>size=8</Item>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default MainLayout
